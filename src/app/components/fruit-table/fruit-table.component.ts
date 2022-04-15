import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {FruitTableViewModel} from './fruit-table-view-model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';

@Component({
  selector: 'app-fruit-table',
  templateUrl: './fruit-table.component.html',
  styleUrls: ['./fruit-table.component.scss'],
  providers: [FruitTableViewModel]
})
export class FruitTableComponent implements OnInit , AfterViewInit{
  columnsToDisplay = ['id', 'name', 'carbohydrates', 'genus',  'family', 'order', 'calories', 'sugar'];
  dropDownDisplay = ['Name Ascending', 'Name Descending', 'Carbohydrates Ascending', "Carbohydrates Descending"];
  selectedColumn = 'Name Ascending';

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  constructor(public viewModel: FruitTableViewModel, private _liveAnnouncer: LiveAnnouncer) {
    viewModel.fruitData$.subscribe(data=> {
      this.dataSource.data = data
    })
  }

  ngOnInit() {
    this.filterTable();
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Carbohydrates Descending': return item.nutritions.carbohydrates;
        case 'Carbohydrates Ascending': return item.nutritions.carbohydrates;
        case 'Name Descending': return item.name;
        case 'Name Ascending': return item.name;
        default: return item[property];
      }
    }
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterTable() {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      return (
          data.name.toLocaleLowerCase().includes(filter) || data.genus.toLocaleLowerCase().includes(filter)
          ||data.family.toLocaleLowerCase().includes(filter)||data.order.toLocaleLowerCase().includes(filter)
      );
    };
  }
  changeSortedColumn(event: any) {
    debugger;
    this.selectedColumn = event.value;
    const sortState: Sort = {active: this.selectedColumn, direction: (event.value.includes('Ascending')?'asc':'desc')};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  styleCaloriesColumn(element) {
    return (element.nutritions.calories <= '50') ? {fontWeight: 'bold', color: '#31BF5D'}:
        {fontWeight: '300', color: 'black'}
  }
  styleSugarColumn(element) {
    return (element.nutritions.sugar >= '8') ? {color: '#31BF5D'}: { color: 'black'}
  }
}
