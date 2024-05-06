import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule} from '@ionic/angular';
import { ToastController, AlertController} from '@ionic/angular';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink,  ReactiveFormsModule]
})
export class LogInPage implements OnInit {

  typePassword : String = "password"
  userForm: FormGroup<{ email: FormControl<string>; password: FormControl<string>; }>;
  usersService = inject(UsersService);

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.userForm = new FormGroup({
      email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]})
    })
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    this.tokenCheck();
  }

  showPassword() {
    this.typePassword = this.typePassword === "password" ? "text" : "password";
  }

  async login() {
    if (this.userForm.status !== 'VALID') {
      this.toastPresent();
    } else {
      const response = await this.usersService.login(this.userForm.value);
      const status = response.status;
      const message = response.message;
      const errors = response.errors;

      console.log(status);


      if(status === false) {
        this.alertPresent(message,errors);
      } else {
        localStorage.setItem("tokenUser", response.token!);
        this.router.navigate(['my-notes']);
      }
    }
  }

  async toastPresent() {
    const toast = await this.toastController.create({
      message: "Algunos de los campos es incorrecto, por favor vuelve a corroborarlos.",
      duration: 1500,
      position: 'bottom',
      color: 'danger',
      mode: 'ios'
    });

    await toast.present();
  }

  async alertPresent(header: string, message?:string) {
    const alert = await this.alertController.create({
      header: header,
      message: !message ? message : "",
      mode: 'ios',
      buttons: [
        {
          text: 'Aceptar',
          htmlAttributes: {
            'arial-label': 'close'
          }
        }
      ]
    });

    await alert.present()
  }

  tokenCheck() {
    const tokenUser = localStorage.getItem("tokenUser");
    if(tokenUser !== null){
      this.router.navigate(['my-notes']);
    }
  }
}
