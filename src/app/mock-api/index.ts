import { ActivitiesMockApi } from 'app/mock-api/pages/activities/api';
import { AnalyticsMockApi } from 'app/mock-api/dashboards/analytics/api';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { SearchMockApi } from 'app/mock-api/common/search/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { UserMockApi } from 'app/mock-api/common/user/api';
import { OverviewMockApi } from './dashboards/overview/api';

export const mockApiServices = [
    ActivitiesMockApi,
    AuthMockApi,
    AnalyticsMockApi,
    IconsMockApi,
    NavigationMockApi,
    NotificationsMockApi,
    OverviewMockApi,
    SearchMockApi,
    ShortcutsMockApi,
    UserMockApi
];
