import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import UserModel from "@shared/models/user.model";
import { BehaviorSubject, filter, map, Observable, switchMap } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { user } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public user$!: Observable<UserModel>;

  public isAuthenticated$: BehaviorSubject<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private fs: AngularFirestore,
    private router: Router,
  ) {
    this.isAuthenticated$ = new BehaviorSubject<boolean>(
      !!localStorage.getItem("user"),
    );
    this.user$ = this.auth.user.pipe(
      filter(user => {
        if (!user) {
          this.isAuthenticated$.next(false);
          this.router.navigateByUrl("/login");
        }
        return !!user;
      }),
      switchMap(user => {
        return this.fs
          .collection<UserModel>("/users", ref =>
            ref.where("uid", "==", user?.uid),
          )
          .valueChanges()
          .pipe(
            map(users => users[0]),
            tap(user => {
              this.isAuthenticated$.next(!!user);
              localStorage.setItem("user", JSON.stringify(user));
            }),
          );
      }),
    );
  }

  public async register(user: UserModel) {
    return this.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        this.fs
          .collection<UserModel>("/users")
          .add({
            ...user,
            uid: res.user!.uid,
          })
          .then(async newUser => {
            await newUser.update({
              id: newUser.id,
            });
          });
      });
  }

  public async login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.isAuthenticated$.next(true);
    });
  }

  public async logout() {
    await this.router.navigate(["/login"]).then(async () => {
      await this.auth.signOut().then(() => {
        this.isAuthenticated$.next(true);
        localStorage.removeItem("user");
      });
    });
  }
}
