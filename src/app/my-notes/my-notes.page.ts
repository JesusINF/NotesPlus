import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotesService } from '../services/notes.service';
import { Note } from '../interfaces/note';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.page.html',
  styleUrls: ['./my-notes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class MyNotesPage implements OnInit {

  notesService = inject(NotesService);
  notes: Note[] = [];
  noteForm: FormGroup<{ title: FormControl<string>; description: FormControl<string>; }>;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alerController: AlertController
  ) {
    this.noteForm = new FormGroup({
      title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    })
  }

  ngOnInit() {
    this.getNotes();
  }

  async getNotes() {
    const response = await this.notesService.notes();
    const status = response.status;

    if (!status) {
      this.alertPresent("Parece que tu sesión a expirado intenta iniciando sesión.");
      sessionStorage.removeItem('tokenUser');
      this.router.navigate(['log-in']);
    } else {
      this.notes = response.data!;
    }
  }

  async add() {
    if (this.noteForm.status !== 'VALID') {
      this.toastPresentError();
    } else {
      const response = await this.notesService.add(this.noteForm.value);
      const status = response.status;

      if (!status) {
        this.alertPresent("Existió un error al agregar tu nota");
      } else {
        this.getNotes()
        this.noteForm.reset();
        this.toastPresentSuccess();
      }
    }
  }

  async delete(id: number) {
    const response = await this.notesService.delete(id);
    const status = response.status;

    if(!status) {
      this.alertPresent("No se pudo borrar esta nota.");
    } else {
      this.getNotes()
      this.toastPresentSuccess();
    }
  }

  prepareForm(title: string, description: string){
    this.noteForm.controls['title'].setValue(title);
    this.noteForm.controls['description'].setValue(description);
  }

  cleanForm() {
    this.noteForm.reset();
  }

  async update(id:number) {
    if (this.noteForm.status !== 'VALID') {
      this.toastPresentError();
    } else {
      const response = await this.notesService.update(this.noteForm.value, id);
      const status = response.status;

      if (!status) {
        this.alertPresent("Existió un error al intentar actualizar tu información.");
        this.noteForm.reset();
      } else {
        this.getNotes()
        this.noteForm.reset();
        this.toastPresentSuccess();
      }
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
