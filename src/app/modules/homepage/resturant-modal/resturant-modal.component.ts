import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-resturant-modal',
  templateUrl: './resturant-modal.component.html',
  styleUrl: './resturant-modal.component.scss'
})
export class ResturantModalComponent implements OnInit {

  createRecordform!: FormGroup;
  isEdit: boolean = false;
  selectedItem: any;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ResturantModalComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.selectedItem = data.selectedItem;
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getResturantData(this.selectedItem.id);
    }
  }

  initializeForm() {
    this.createRecordform = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      description: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      address: [null, Validators.required],
      zip: [null, Validators.required],
      mobile: [null, Validators.required],
      city: [null, Validators.required],
    });
  }

  save() {
    if (this.createRecordform.valid) {
      this.dialogRef.close(this.createRecordform.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

  getResturantData(id: number) {
    this.createRecordform?.patchValue(this.selectedItem);
  }

}
