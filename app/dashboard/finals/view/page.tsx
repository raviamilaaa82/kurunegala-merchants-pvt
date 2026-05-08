// import Form from '@/app/ui/documents/create-form';
import Breadcrumbs from '@/app/ui/final/breadcrumbs';


export default async function Page() {

    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Approved Data', href: '/dashboard/finals' },
            ]} />
            {/* <Form /> */}
        </main>
    );
}