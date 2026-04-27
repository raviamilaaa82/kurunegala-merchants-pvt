import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Documents,
  ImageListType,
  User,
  // Role

} from './definitions';
import { formatCurrency } from './utils';
import exp from 'constants';
import { sql } from './db';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
type UserWithRole = {
  id: string;
  email: string;
  name: string;
  role_id: number;
  role_slug: string;
  role_name: string;
};

type Role = {
  id: number;
  slug: string;
  display_name: string;
};


type RoleWithPermisson = {
  id: number;
  slug: string;
  display_name: string;
  permissions: string[] | null;
};


const ITEMS_PER_PAGE = 6;
//newly added code
export async function fetchUsersWithRoles() {
  const users = await sql<UserWithRole[]>`
    SELECT
      u.id,
      u.email,
      u.name,
      r.id           AS role_id,
      r.slug         AS role_slug,
      r.display_name AS role_name
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    ORDER BY u.name ASC
  `;
  // return result.rows;
  return users;
}

export async function fetchAllRoles() {
  const roles = await sql<Role[]>`
    SELECT id, slug, display_name FROM roles ORDER BY id
  `;
  return roles;
}


export async function fetchUsersWithRolesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*) FROM users u LEFT JOIN roles r ON r.id = u.role_id     
    WHERE u.name ILIKE ${`%${query}%`} OR u.email ILIKE ${`%${query}%`} `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users with roles.');
  }

}


export async function fetchFilteredUsersWithRoles(query: string) {
  try {
    const users = await sql<UserWithRole[]>`
    SELECT
      u.id,
      u.email,
      u.name,
      r.id           AS role_id,
      r.slug         AS role_slug,
      r.display_name AS role_name
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
		WHERE
		   u.name ILIKE ${`%${query}%`} 
		
		ORDER BY id ASC
	  `;

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user table.');
  }
}

export async function fetchAllRolesWithTheirPermissions() {
  try {
    const roles = await sql<RoleWithPermisson[]>`
        SELECT
          r.id,
          r.slug,
          r.display_name,
          ARRAY_AGG(rp.permission) FILTER (WHERE rp.permission IS NOT NULL)
            AS permissions
        FROM roles r
        LEFT JOIN role_permissions rp ON rp.role_id = r.id
        GROUP BY r.id
        ORDER BY r.id
      `;
    // const roles = rolesResult.rows as Role[];  // ✅ cast here

    return roles;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all roles with permission.');
  }
}

//newly added code



export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.customer_id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}


export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.customer_id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomerPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*) FROM customers WHERE customers.name 
    ILIKE ${`%${query}%`} OR customers.email ILIKE ${`%${query}%`}`;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }

}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
      customers.mobile,
      customers.loc_link,
      customers.is_enabled
		 
		FROM customers
		
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.id DESC
	  `;
    // SELECT
    // 		  customers.id,
    // 		  customers.name,
    // 		  customers.email,
    // 		  customers.image_url,
    // 		  COUNT(invoices.id) AS total_invoices,
    // 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
    // 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
    // 		FROM customers
    // 		LEFT JOIN invoices ON customers.customer_id = invoices.customer_id
    // 		WHERE
    // 		  customers.name ILIKE ${`%${query}%`} OR
    //         customers.email ILIKE ${`%${query}%`}
    // 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
    // 		ORDER BY customers.name ASC
    // const customers = data.map((customer) => ({
    //   ...customer,
    //   total_pending: formatCurrency(customer.total_pending),
    //   total_paid: formatCurrency(customer.total_paid),
    // }));

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchDocuments() {
  try {
    const customers = await sql<Documents[]>`
      SELECT
        id,
        document,
        is_valid
      FROM tbl_documents
      ORDER BY id ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all documents.');
  }

}



export async function fetchFilteredDocuments(query: string) {
  try {
    const data = await sql<Documents[]>`
		SELECT
    id,
    document,
    is_valid
		 
		FROM tbl_documents
		
		WHERE
		  document ILIKE ${`%${query}%`} 
		
		ORDER BY id ASC
	  `;


    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}


export async function fetchDocumentPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*) FROM tbl_documents WHERE document ILIKE ${`%${query}%`}`;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }

}

export async function fetchDocumentById(id: string) {

  try {
    const data = await sql<Documents[]>`
      SELECT
    id,
    document,
    is_valid
		 
		FROM tbl_documents
		
		WHERE id = ${id};
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');

  }

}

export async function fetchImageListFromLocalDb(masterId: string | null) {

  try {
    const data = await sql<ImageListType[]>`
     SELECT cd.id, cd.document_id AS document_id, cd.file_key AS file_key, cd.file_name AS file_name,doc.document AS document_type
             FROM public.customer_details cd inner join tbl_documents doc on cd.document_id=doc.id  WHERE cd.master_id = ${masterId}
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');

  }


}

export async function fetchCustomerById(id: string) {

  try {
    const data = await sql<CustomersTableType[]>`
     SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
      customers.mobile,      
      customers.loc_link
		FROM customers		
		WHERE
		  customers.id= ${id};		
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');

  }

}

// export async function fetchUsers() {
//   try {
//     const users = await sql<User[]>`
//       SELECT
//         id, name, email
//       FROM users
//       ORDER BY id ASC
//     `;

//     return users;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all users.');
//   }

// }

export async function fetchFilteredUsers(query: string) {
  try {
    const data = await sql<User[]>`
		SELECT
        id, name, email,is_enabled,phone,user_name
      FROM users			
		WHERE
		  name ILIKE ${`%${query}%`} 
		
		ORDER BY id ASC
	  `;

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user table.');
  }
}

export async function fetchUsersPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*) FROM users WHERE name ILIKE ${`%${query}%`}`;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }

}


export async function fetchUserById(id: string) {

  try {
    const data = await sql<User[]>`
  SELECT
        id, name, email,is_enabled,phone,user_name
      FROM users			
		WHERE
		  id= ${id};		
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user table.');

  }

}

export async function fetchFilteredRoles(query: string) {
  try {
    const data = await sql<Role[]>`
		SELECT
    id, role, is_enabled		 
		FROM tbl_roles		
		WHERE
		  role ILIKE ${`%${query}%`} 		
		ORDER BY id ASC
	  `;

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch role table.');
  }
}


export async function fetchRoleById(id: string) {

  try {
    const data = await sql<Role[]>`
  SELECT
        id, role, is_enabled
      FROM tbl_roles			
		WHERE
		  id= ${id};		
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user table.');

  }

}

export async function fetchRolePages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*) FROM tbl_roles WHERE role ILIKE ${`%${query}%`}`;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }

}


export async function fetchRoles() {
  try {
    const roles = await sql<Role[]>`
      SELECT
        id, role, is_enabled
      FROM tbl_roles			
      ORDER BY id ASC
    `;

    return roles;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all roles.');
  }

}


