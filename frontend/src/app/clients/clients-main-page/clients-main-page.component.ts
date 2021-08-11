import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../service/api.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Client } from "../../classes/client";
import {ClientDialogComponent} from "../client-dialog/client-dialog.component";
import {PaginatedResponse} from "../../classes/paginated-response";
import { debounceTime } from "rxjs/operators";
import {SelectionModel} from "@angular/cdk/collections";
import {RemoveClientDialogComponent} from "../remove-client-dialog/remove-client-dialog.component";
import { MatPaginator } from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-clients-main-page',
  templateUrl: './clients-main-page.component.html',
  styleUrls: ['./clients-main-page.component.scss']
})
export class ClientsMainPageComponent implements OnInit, AfterViewInit {

  filtersForm = new FormGroup({
    phone: new FormControl(null),
    name: new FormControl(null),
    created_from: new FormControl(null),
    created_to: new FormControl(null),
    updated_from: new FormControl(null),
    updated_to: new FormControl(null),
  });

  showFilters = true;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  totalLength = 0;
  dataSource = new MatTableDataSource<Client>([]);
  displayedColumns: string[] = [
    'select', 'phone', 'name', 'email', 'created', 'updated', 'additional_info'
  ];

  selection = new SelectionModel<Client>(true, []);

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.filtersForm.valueChanges.pipe(debounceTime(400)).subscribe(value => {
      this.loadClients();
    });
  }

  ngAfterViewInit() {
    this.loadClients();
  }

  loadClients(): void {
    const filters = this.filtersForm.value;
    for (const key of ['created_from', 'created_to', 'updated_from', 'updated_to']) {
      if (filters[key]) {
        filters[key] = new Date(filters[key]).toISOString();
      }
    }
    filters.limit = this.paginator?.pageSize;
    filters.offset = (this.paginator?.pageIndex || 0) * (this.paginator?.pageSize || 0);

    this.api.getPaginatedClients(filters).subscribe(
      (res: PaginatedResponse<Client>) => {
        this.selection.clear();
        this.dataSource.data = res.results;
        this.totalLength = res.count;
      }
    );
  }

  handlePageChange() {
    this.loadClients();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.filtersForm.reset();
  }

  openCreateClientDialog(client?: Client): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      minWidth: '70%', maxWidth: '80%', maxHeight: '90vh', data: {element: client}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) { this.loadClients(); }
    });
  }

  openRemoveClientsDialog(): void {
    const dialogRef = this.dialog.open(RemoveClientDialogComponent, {
      minWidth: '70%', maxWidth: '80%', maxHeight: '90vh', data: {elements: this.selection.selected}
    });
    dialogRef.afterClosed().subscribe((reload: boolean) => {
      if (reload) {
        this.loadClients();
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows ?? numSelected > 0;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}
