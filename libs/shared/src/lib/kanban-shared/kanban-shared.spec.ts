import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanShared } from './kanban-shared';

describe('KanbanShared', () => {
  let component: KanbanShared;
  let fixture: ComponentFixture<KanbanShared>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanShared],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanShared);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
