import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { Router, RouterLink } from '@angular/router';
import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class MyProfilePage implements OnInit {
  userForm: FormGroup<{ name: FormControl<string>; email: FormControl<string>; }>;
  user!: User;
  usersService = inject(UsersService);
  isOnEdit: boolean = true;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alerController: AlertController
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    })
  }

  ngOnInit() {
    this.getMyProfile()
  }

  async getMyProfile() {
    const response = await this.usersService.profile();
    const status = response.status;

    if (!status) {
      this.alertPresent("Parece que tu sesión a expirado intenta iniciando sesión.");
      sessionStorage.removeItem('tokenUser');
      this.router.navigate(['log-in']);
    } else {
      this.user = response.data!;
      this.userForm.controls['name'].setValue(this.user?.name);
      this.userForm.controls['email'].setValue(this.user?.email);
      this.userForm.disable()
      this.isOnEdit = true;
    }
  }

  toggleEdit() {
    if (!this.isOnEdit) {
      this.getMyProfile()
    } else {
      this.isOnEdit = false;
      this.userForm.enable();
    }
  }

  async edit() {
    if (this.userForm.status !== 'VALID') {
      this.toastPresentError();
    } else {
      const response = await this.usersService.update(this.userForm.value);
      const status = response.status;

      if (!status) {
        this.alertPresent("Existió un error al intentar actualizar tu información.");
        this.getMyProfile()
      } else {
        this.getMyProfile()
        this.toastPresentSuccess()
      }
    }

  }

  async logout() {
    const response = await this.usersService.logout();
    const status = response.status;
    if (!status) {
      this.alertPresent("Existió un error al intentar cerrar tu sesión.");
    } else {
      this.toastPresentSuccess();
      localStorage.removeItem('tokenUser');
      this.router.navigate(['log-in']);
    }
  }

  async delete() {
    const response = await this.usersService.delete();
    const status = response.status;
    if (!status) {
      this.alertPresent("Existió un error al intentar eliminar tu cuenta.");
    } else {
      this.toastPresentSuccess();
      localStorage.removeItem('tokenUser');
      this.router.navigate(['log-in']);
    }
  }

  async toastPresentError() {
    const toast = await this.toastController.create({
      message: "Algunos de los campos es incorrecto, por favor vuelve a corroborarlos.",
      duration: 1500,
      position: 'bottom',
      color: 'danger',
      mode: 'ios'
    });

    await toast.present();
  }

  async toastPresentSuccess() {
    const toast = await this.toastController.create({
      message: "Operación realizada con éxito.",
      duration: 1500,
      position: 'bottom',
      color: 'success',
      mode: 'ios'
    });

    await toast.present();
  }

  async alertPresent(header: string, message?: string) {
    const alert = await this.alerController.create({
      header: header,
      message: message,
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

}
