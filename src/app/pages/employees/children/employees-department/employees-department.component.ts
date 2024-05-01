import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
} from "@angular/core";
import { EmployeesEmployeeComponent } from "../employees-employee/employees-employee.component";
import { UserModel } from "../../models/user.model";
import DepartmentModel from "../../models/department.model";
import { BehaviorSubject, Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { EmployeesDepartmentEditDialogComponent } from "../employees-department-edit-dialog/employees-department-edit-dialog.component";
import { EmployeesModule } from "../../modules/employees.module";
import { EmployeesAddDialogComponent } from "../employees-add-dialog/employees-add-dialog.component";
import { DepartmentsService } from "../../services/departments.service";
import { MatStepper } from "@angular/material/stepper";
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { EmployeeDepartmentInfoCardComponent } from "./components/employee-department-info-card/employee-department-info-card.component";
import { UserService } from "../../../../shared/services/user.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

@Component({
  selector: "app-employees-department",
  standalone: true,
  imports: [
    EmployeesModule,
    EmployeesEmployeeComponent,
    MatStepper,
    LoaderComponent,
    EmployeeDepartmentInfoCardComponent,
  ],
  templateUrl: "./employees-department.component.html",
  styleUrl: "./employees-department.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesDepartmentComponent implements OnInit {
  @Input({ required: true })
  public department!: DepartmentModel;

  protected employees$!: Observable<UserModel[]>;
  protected manager!: UserModel;

  constructor(
    private departmentService: DepartmentsService,
    private userService: UserService,
    private dialog: MatDialog,
    private destroyRef: DestroyRef,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.employees$ = this.departmentService.getEmployees(this.department.id);
    this.userService
      .getById(this.department.managerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => (this.manager = value!));
  }

  protected async navigateToDepartmentPage() {
    await this.router.navigate([`employees/${this.department.slug}`], {
      state: { name: this.department.name },
    });
  }

  protected openDepartmentEditDialog() {
    this.dialog.open(EmployeesDepartmentEditDialogComponent, {
      panelClass: "app-default-dialog",
      data: { department: this.department },
    });
  }

  protected openAddEmployeeDialog() {
    this.dialog.open(EmployeesAddDialogComponent, {
      panelClass: "app-default-dialog",
      data: { id: this.department.id },
    });
  }

  protected readonly parent = parent;
}
