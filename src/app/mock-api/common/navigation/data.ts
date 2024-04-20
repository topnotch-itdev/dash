/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'overview',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:check-circle',
        link : '/overview'
    },
    {
        id   : 'radioStreaming',
        title: 'Radio Streaming',
        type : 'collapsable',
        icon : 'record_voice_over',
        children:[]
    },
    {
        id   : 'websiteCMS',
        title: 'Website CMS',
        type : 'collapsable',
        icon : 'important_devices',
        children:[]
    },
];
