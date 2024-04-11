import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GarageComponent } from './pages/garage/garage.component';
import { WinnersComponent } from './pages/winners/winners.component';

const routes: Routes = [
  { path: 'garage', component: GarageComponent },
  { path: 'winners', component: WinnersComponent },
  { path: '', redirectTo: '/garage', pathMatch: 'full' },
  { path: '**', redirectTo: '/garage' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
