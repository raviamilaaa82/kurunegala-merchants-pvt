// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  is_enabled: boolean,
  phone: string,
  user_name: string,
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type Documents = {
  id: number;
  document: string;
  is_valid: boolean;
}
export type Branches = {
  id: number;
  branch: string;
  branch_code: string;
  com_code: string;
  com_id: string;
  company: string;
  is_valid: boolean;
}
export type Company = {
  id: number;
  company: string;
  com_code: string;
  is_valid: boolean;
}
export type ImageListType = {
  document_id: number;
  file_key: string;
  file_name: string;
  document_type: string
}

export type ImageListTypeWithSubmit = {
  submission_id: string
  status: string,
  agent_id: string,
  submitted_at?: string;
  admin_note?: string;
  manager_note?: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  customer_mobile?: string;
  document_id: number;
  file_key: string;
  file_name: string;
  deleted_at?: string;
  document_type: string
}


// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  // amount: number;
  // status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  mobile: string;
  loc_link: string;
  // total_invoices: number;
  // total_pending: number;
  // total_paid: number;
};



export type CustTableTypeWithSubmission = {
  submission_id: string,
  status: string,
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  loc_link: string;
  role_slug: string;       // 👈 add
  role_name: string;
  image_url: string;
  cust_code: string;

};
export type FinalUploadKey = {
  id: string;
  file_key: string;
  file_name: string;
}

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  // total_invoices: number;
  // total_pending: string;
  // total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
export type Role = {
  id: number;
  display_name: string;

};


export type ActivityHistory = {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  page: string;
  created_at: string;
}

