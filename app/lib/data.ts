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
  CustTableTypeWithSubmission,
  ImageListTypeWithSubmit,
  Branches,
  Company,
  FinalUploadKey,
  ActivityHistory
  // Role

} from './definitions';
import { formatCurrency } from './utils';
import exp from 'constants';
import { sql } from './db';
import { auth } from '@/auth';
import { stat } from 'fs';

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


const ITEMS_PER_PAGE = 100;
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
//this function is no need i think need to check
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

//fetchin customer with submission 
export async function fetchFilteredSubmission(query: string, currentPage: number, status: string, agentId: string | null = null, roleId: number | undefined, branchId: string | null = null) {
  try {
    let new_status = '';
    const session = await auth();
    // if (!session?.user?.id) {
    //   throw new Error('Unauthorized');
    // }

    const userId = session?.user?.id ?? '';
    const role_id = session?.user.roleId;
    // const role_slug = session?.user.roleSlug;
    const role_slug = session?.user.roleSlug ?? '';


    // const resolvedAgentId = role_slug === 'agent' ? agentId : null; // this line make only agent for id as parameter to query. admin and manager dont need.
    // const resolvedAgentId = role_slug === 'agent' ? agentId : userId;
    const resolvedAgentId = userId;



    const isAgentOrDraftOnly = role_slug === 'agent';


    let statusFilter: string[] = [];
    if (role_slug === 'admin') {
      const map: Record<string, string[]> = {
        draft: ['draft'],
        pending: ['pending_admin', 'pending_manager'],
        rejected: ['admin_rejected', 'manager_rejected'],
      };
      statusFilter = status === ''
        ? ['draft', 'pending_admin', 'admin_rejected', 'manager_rejected', 'pending_manager']
        : (map[status] ?? []);

    } else if (role_slug === 'manager') {
      const map: Record<string, string[]> = {
        draft: ['draft'],
        pending: ['pending_manager'],
        rejected: ['manager_rejected'],
        approved: ['approved'],
      };
      statusFilter = status === ''
        ? ['draft', 'pending_manager', 'manager_rejected', 'approved']
        : (map[status] ?? []);

    } else if (role_slug === 'agent') {
      const map: Record<string, string[]> = {
        draft: ['draft'],
        pending: ['pending_admin'],
        rejected: ['admin_rejected', 'manager_rejected'],
      };
      statusFilter = status === ''
        ? ['draft', 'pending_admin', 'admin_rejected', 'manager_rejected']
        : (map[status] ?? []);
    }

    if (statusFilter.length === 0 && status !== '') {
      statusFilter = ['__none__'];
    }


    const ITEMS_PER_PAGE = 6;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    // const agent = agentId ?? null;


    const data = sql<CustTableTypeWithSubmission[]>`
     SELECT 
      s.id AS submission_id,
      s.status,
      s.admin_note,
      s.manager_note,
      c.id AS customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.image_url,
      c.mobile AS customer_mobile,
      c.loc_link,
      c.cust_code,
      r.slug AS role_slug,            
      r.display_name AS role_name    
  FROM submission s
  LEFT JOIN customers c ON c.id = s.customer_id
  LEFT JOIN users u ON u.id::text = s.agent_id::text
  LEFT JOIN roles r ON r.id = u.role_id
  WHERE (
      c.name ILIKE ${`%${query}%`} OR
      c.cust_code ILIKE ${`%${query}%`} OR
      c.mobile ILIKE ${`%${query}%`}
     
  )
  AND s.status::text = ANY(${statusFilter}::text[])
  AND (${branchId}::text IS NULL OR c.branch_id::text = ${branchId}::text)
  AND (  
     CASE
        -- DRAFT rules
        WHEN s.status = 'draft' AND ${isAgentOrDraftOnly} THEN 
            s.agent_id::text = ${userId}::text          -- own draft
            OR r.slug IN ('admin', 'manager')            -- OR created by admin/manager
        WHEN s.status = 'draft' THEN 
            s.agent_id::text = ${userId}::text           -- admin/manager: own drafts only

        -- NON-DRAFT rules
        WHEN ${isAgentOrDraftOnly} THEN 
            s.agent_id::text = ${userId}::text           -- agent: own records only
        ELSE TRUE                                        -- admin/manager: see all
    END
  )
    ORDER BY s.id DESC
  LIMIT ${ITEMS_PER_PAGE}
  OFFSET ${offset}
`;

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}


export async function fetchImagesKeysbWithSubmission(submissionId: string | null) {

  try {
    const data = await sql<ImageListTypeWithSubmit[]>`
     SELECT 
    s.id AS submission_id,
    s.status,
    s.agent_id,
    s.submitted_at,
    s.admin_note,
    s.manager_note,

    c.id AS customer_id,
    c.name AS customer_name,
    c.email AS customer_email,
    c.mobile AS customer_mobile,
    c.loc_link,

    d.id,
	  d.document_id AS document_id,
    d.file_key,
    d.file_name,
    d.deleted_at,
    doc.document AS document_type

FROM submission s
LEFT JOIN customers c ON c.id = s.customer_id
LEFT JOIN document d ON d.submission_id = s.id
LEFT JOIN tbl_documents doc ON d.document_id = doc.id

WHERE s.id = ${submissionId}
ORDER BY d.id;
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');

  }


}


export async function fetchImagesKeyForUploadFinalDoc(submissionId: string | null) {

  try {
    const data = await sql<FinalUploadKey[]>`
    SELECT id, file_key, file_name 
	FROM public.document WHERE submission_id = ${submissionId};     
`;

    return data;

  } catch (error) {

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
      WHERE is_valid=true
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
     SELECT d.id,
      d.document_id AS document_id,
       d.file_key AS file_key,
        d.file_name AS file_name,
        doc.document AS document_type
             FROM document d 
             inner join tbl_documents doc on
              d.document_id=doc.id 
              WHERE d.master_id = ${masterId}
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');

  }


}


export async function fetchCustomerBySubmissionId(submissionId: string | null) {
  try {

    const data = await sql<CustTableTypeWithSubmission[]>`
  SELECT 
      s.id AS submission_id,
      s.status,
      c.id AS customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.image_url,
      c.mobile AS customer_mobile,
      c.loc_link,
      c.cust_code,
      c.branch_id
  FROM submission s
  LEFT JOIN customers c ON c.id = s.customer_id
  WHERE s.id=${submissionId};
`;

    return data[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
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
        id, display_name
      FROM roles			
      ORDER BY id ASC
    `;

    // return roles;
    return roles;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all roles.');
  }

}

export async function fetchCompanies() {
  try {
    const companies = await sql<Company[]>`
      SELECT id, company, com_code, is_valid
	FROM company		
      ORDER BY id ASC
    `;

    // return roles;
    return companies;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all roles.');
  }

}




export async function fetchFilteredBranch(query: string) {
  try {
    const data = await sql<Branches[]>`

SELECT 
    b.id,
    b.branch,
    b.is_valid,
    b.branch_code,
        b.com_id,   
    c.company,
    c.com_code    
FROM branches b
JOIN company c ON b.com_id = c.id
WHERE
		  b.branch ILIKE ${`%${query}%`} OR
       c.company ILIKE ${`%${query}%`}
ORDER BY id ASC		
	  `;
    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch branches table.');
  }
}


export async function fetchBranchPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*) FROM branches WHERE branch ILIKE ${`%${query}%`}`;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }

}
export async function fetchdBranches() {

  try {
    const data = await sql<Branches[]>`
SELECT id, branch, is_valid, branch_code, com_id
	FROM branches WHERE is_valid='true'
ORDER BY id ASC	`;
    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch branches table.');
  }
}

export async function fetchUserActivity(query: string) {

  try {
    const data = await sql<ActivityHistory[]>`
        SELECT 
            ua.id,
            ua.user_name,
            ua.action,
            ua.page,
            ua.created_at,
            r.display_name AS role_name
        FROM user_activity ua
        LEFT JOIN users u ON u.id::text = ua.user_id
        LEFT JOIN roles r ON r.id = u.role_id
        WHERE 
        ua.user_name ILIKE ${`%${query}%`} OR
        ua.page ILIKE ${`%${query}%`} OR
         ua.created_at::text ILIKE ${`%${query}%`} OR
         r.display_name ILIKE ${`%${query}%`}
        ORDER BY ua.created_at DESC
        LIMIT 100
    `;
    return data;


  } catch (error) {

    console.error('Database Error:', error);
    throw new Error('Failed to fetch activity details.');
  }

}


export async function fetchUserActivityPages(query: string) {
  try {
    const data = await sql`
        SELECT COUNT(*)
        FROM user_activity ua
        LEFT JOIN users u ON u.id::text = ua.user_id
        LEFT JOIN roles r ON r.id = u.role_id
        WHERE 
        ua.user_name ILIKE ${`%${query}%`} OR
        ua.page ILIKE ${`%${query}%`} OR
         ua.created_at::text ILIKE ${`%${query}%`} OR
         r.display_name ILIKE ${`%${query}%`}         
           `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }

}