import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  OnInit,
} from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "../../modules/material/material.module";
import { MatToolbar } from "@angular/material/toolbar";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { MatBadgeModule } from "@angular/material/badge";
import { HeaderProfileButtonComponent } from "./components/header-profile-button/header-profile-button.component";
import { BreadCrumbComponent } from "@shared/components/bread-crumb/bread-crumb.component";
import { AuthService } from "@pages/auth/services/auth-service/auth.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    MaterialModule,
    MatBadgeModule,
    HeaderProfileButtonComponent,
    BreadCrumbComponent,
    CommonModule,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title!: string;
  protected isAuth$!: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
  ) {
    this.isAuth$ = this.authService.isAuthenticated$;
  }
}
