import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { StreamerrLayoutModule } from 'app/layout/layouts/streamerr/streamerr.module';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { SettingsModule } from 'app/layout/common/settings/settings.module';
import { SharedModule } from 'app/shared/shared.module';

const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Default vertical 'classic' streamerr theme
    StreamerrLayoutModule,
];

@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports     : [
        SharedModule,
        SettingsModule,
        ...layoutModules
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule
{
}
