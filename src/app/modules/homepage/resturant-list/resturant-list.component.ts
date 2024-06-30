import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from '../../../shared/api-handler.service';
import { ResturantModalComponent } from '../resturant-modal/resturant-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-resturant-list',
  templateUrl: './resturant-list.component.html',
  styleUrl: './resturant-list.component.scss'
})
export class ResturantListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'description', 'address', 'zip', 'mobile', 'city', 'action'];
  dataSource = new MatTableDataSource();
  datalist = [];
  value = '';
  recordFound: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private apiService: ApiHandlerService) { }

  ngOnInit(): void {
    this.getResturantList();
  }

  getResturantList() {
    let url = 'resturant';
    this.apiService.getRequest(url).subscribe(response => {
      this.datalist = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onSearchKeyUp(search: { value: any; }) {
    let currentFilter = search.value;
    this.dataSource.filter = currentFilter;

  }

  deleteRecord(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteRequest('resturant/', id).subscribe(response => {
          this.getResturantList();
          Swal.fire(
            'Deleted!',
            'Record has been deleted',
            'success'
          )
        })
      }
    })
  }

  editRecord(id: any, data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '90%';
    dialogConfig.width = '50%';
    const initialState = {
      isEdit: true,
      selectedItem: data,
    };
    const dialogRef = this.dialog.open(ResturantModalComponent, {
      ...dialogConfig,
      data: initialState
    });
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          this.updateRecord(data, id);
        }
      }
    );
  }

  addResturant() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '90%';
    dialogConfig.width = '50%';
    const initialState = {
      isEdit: false,
    };
    const dialogRef = this.dialog.open(ResturantModalComponent, {
      ...dialogConfig,
      data: initialState
    });
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          this.createNewRecord(data);
        }
      }
    );
  }

  createNewRecord(data: any) {
    if (data) {
      let url = 'resturant';
      this.apiService.postRequest(url, data).subscribe({
        next: (response: any) => {
          this.getResturantList();
          this.openSwal('Resturant data stored', 'success');
        },
        error: (error: any) => {
          console.error(error);
          this.openSwal('Something went wrong', 'error');
        }
      });
    }
  }

  updateRecord(data: any, id: any) {
    this.apiService.updateRequest('resturant/', id, data).subscribe({
      next: () => {
        this.getResturantList();
        this.openSwal('Restaurant data updated', 'success');
      },
      error: (error: any) => {
        console.error(error);
        this.openSwal('Something went wrong', 'error');
      }
    });

  }

  openSwal(title: any, icon: any) {
    Swal.fire({
      title: title,
      icon: icon,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: `Ok`,
      denyButtonText: `Don't save`,
    })?.then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {

      }
    })
  }

}
