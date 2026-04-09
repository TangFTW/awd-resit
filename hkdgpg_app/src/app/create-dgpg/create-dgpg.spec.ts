import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDgpg } from './create-dgpg';

describe('CreateDgpg', () => {
  let component: CreateDgpg;
  let fixture: ComponentFixture<CreateDgpg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDgpg],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDgpg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
