import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

  
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { App } from './app/app';
// import { routes } from './app/app.routes';

// bootstrapApplication(App, {
//   providers: [
//     provideRouter(routes),
//     provideAnimations()
//   ]
// }).catch(err => console.error(err));
