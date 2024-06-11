import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInCallbackComponent } from './sign-in-callback.component';

describe('SignInCallbackComponent', () => {
  let component: SignInCallbackComponent;
  let fixture: ComponentFixture<SignInCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
