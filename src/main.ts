import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';
import { AppModule } from 'app/app.module';

if ( environment.production )
{
    enableProdMode();

    Sentry.init({
      dsn: 'https://9370eca7314b4447a38a78f3130533f5@o1084827.ingest.sentry.io/6176763',
      release: 'dash@' + environment.version,
      environment: 'production',
      integrations: [
        // Registers and configures the Tracing integration,
        // which automatically instruments your application to monitor its
        // performance, including custom Angular routing instrumentation
        new Integrations.BrowserTracing({
          tracingOrigins: ['localhost', 'https://dash.unmutedte.ch'],
          routingInstrumentation: Sentry.routingInstrumentation,
        }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

}

platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));
