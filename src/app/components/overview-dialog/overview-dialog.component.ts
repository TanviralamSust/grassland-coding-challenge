import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Fruit} from "../../models/fruit";


@Component({
  selector: 'app-overview-dialog',
  templateUrl: './overview-dialog.component.html',
  styleUrls: ['./overview-dialog.component.css']
})
export class OverviewDialogComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<OverviewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Fruit) {}
onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
