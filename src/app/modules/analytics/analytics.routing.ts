import { Route } from '@angular/router';
import { AnalyticsComponent } from 'app/modules/analytics/analytics.component';
import { AnalyticsResolver } from 'app/modules/analytics/analytics.resolvers';

export const analyticsRoutes: Route[] = [
    {
        path     : ':type/:pid',
        component: AnalyticsComponent,
        resolve  : {
            data: AnalyticsResolver
        }
    }
];
