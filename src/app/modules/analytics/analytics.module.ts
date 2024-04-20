import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { AnalyticsComponent } from 'app/modules/analytics/analytics.component';
import { analyticsRoutes } from 'app/modules/analytics/analytics.routing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InformationComponent } from './information/information.component';
import { NgxLoadingModule } from 'ngx-loading';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import {MatRadioModule} from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { TuneIntegrationComponent } from './tune-integration/tune-integration.component';
import { PlayerComponent } from './player/player.component';
import { IosAppComponent } from './ios-app/ios-app.component';
import { AndroidAppComponent } from './android-app/android-app.component';
import { AlexaSkillComponent } from './alexa-skill/alexa-skill.component';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

@NgModule({
    declarations: [
        AnalyticsComponent,
        InformationComponent,
        NowPlayingComponent,
        TuneIntegrationComponent,
        PlayerComponent,
        IosAppComponent,
        AndroidAppComponent,
        AlexaSkillComponent
    ],
    imports     : [
    NgxLoadingModule.forRoot({}),
        RouterModule.forChild(analyticsRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        NgApexchartsModule,
        MatRadioModule,
        SharedModule,
        MatGridListModule,
        MatCardModule,
        MatInputModule,
        MatSidenavModule,
        NgxMatColorPickerModule,
        MatSlideToggleModule
    ],
    exports: [
        AnalyticsComponent
    ],
    providers: [
        {
          provide: MAT_COLOR_FORMATS,
          useValue: NGX_MAT_COLOR_FORMATS
        }
    ]
})
export class AnalyticsModule
{
}
