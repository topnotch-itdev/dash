import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMD5Pipe } from './shared-md5.pipe';

@NgModule({
    declarations: [
        SharedMD5Pipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedMD5Pipe
    ]
})
export class SharedModule
{
}
