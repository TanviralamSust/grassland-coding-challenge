import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FruitTableViewModel} from './fruit-table-view-model';

//For angular material table Imports
import {MatTableDataSource} from '@angular/material/table';

//For angular table sort Imports
import {MatSort, Sort} from '@angular/material/sort';

//For angular material dialog Imports
import {MatDialog} from '@angular/material/dialog';
import {OverviewDialogComponent} from "../overview-dialog/overview-dialog.component";

@Component({
    selector: 'app-fruit-table',
    templateUrl: './fruit-table.component.html',
    styleUrls: ['./fruit-table.component.scss'],
    providers: [FruitTableViewModel]
})
export class FruitTableComponent implements OnInit, AfterViewInit {
    //For table header
    columnsToDisplay = ['id', 'name', 'genus', 'family', 'order', 'calories', 'carbohydrates', 'sugar'];
    //For dropdown items
    dropDownDisplay = ['Name Ascending', 'Name Descending', 'Carbohydrates Ascending', "Carbohydrates Descending"];
    //Assign initial value in the dropdown
    selectedColumn = 'Name Ascending';

    @ViewChild(MatSort) sort: MatSort;

    //Declare dataSource
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

    constructor(public viewModel: FruitTableViewModel, public dialog: MatDialog) {
        viewModel.fruitData$.subscribe(data => {
            //Assign value to data source for table
            this.dataSource.data = data
        })
    }

    ngOnInit() {
        this.filterTable();

        //Get dropdown value for sorting
        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'Carbohydrates Descending':
                    return item.nutritions.carbohydrates;
                case 'Carbohydrates Ascending':
                    return item.nutritions.carbohydrates;
                case 'Name Descending':
                    return item.name;
                case 'Name Ascending':
                    return item.name;
                default:
                    return item[property];
            }
        }
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    //For filtering table data based on name , family, genus & order header
    filterTable() {
        this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
            return (
                data.name.toLocaleLowerCase().includes(filter) || data.genus.toLocaleLowerCase().includes(filter)
                || data.family.toLocaleLowerCase().includes(filter) || data.order.toLocaleLowerCase().includes(filter)
            );
        };
    }

    //For sorting based on dropdown
    changeSortedColumn(event: any) {
        this.selectedColumn = event.value;
        const sortState: Sort = {
            active: this.selectedColumn,
            direction: (event.value.includes('Ascending') ? 'asc' : 'desc')
        };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
    }

    //For styling calories column
    styleCaloriesColumn(element) {
        return (element.nutritions.calories <= '50') ? {fontWeight: 'bold', color: '#31BF5D'} :
            {fontWeight: '300', color: 'black'}
    }

    //For styling sugar column
    styleSugarColumn(element) {
        return (element.nutritions.sugar >= '8') ? {color: '#31BF5D'} : {color: 'black'}
    }

    //Call dialog
    getFruitDetails(element): void {
        let rowDetails = element;
        let dialogRef = this.dialog.open(OverviewDialogComponent, {
            data: rowDetails
        });
    }
}
