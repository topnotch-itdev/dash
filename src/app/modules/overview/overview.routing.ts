import { Route } from '@angular/router';
import { OverviewComponent } from 'app/modules/overview/overview.component';
import { OverviewResolver } from 'app/modules/overview/overview.resolvers';

export const overviewRoutes: Route[] = [
    {
        path     : '',
        component: OverviewComponent,
        resolve  : {
            userData: OverviewResolver
        }
    }
];
