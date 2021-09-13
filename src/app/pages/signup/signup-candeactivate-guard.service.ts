import { SignupComponent } from './signup.component';
import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class signupDeactivateGuardService
  implements CanDeactivate<SignupComponent>
{
  canDeactivate(component: SignupComponent): boolean {
    if (component.signupForm.dirty) {
      return confirm('Are you sure you want to discard your changes ?');
    }
    return true;
  }
}
