import { usePage } from '@inertiajs/react';
import { SVGAttributes} from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const {app_settings}:any = usePage().props
    return (
        <img src={`/uploads/${app_settings.logo}`} alt="" />
    );
}
