import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "./service/user.service";
import { User } from './models/user';

declare let DataTable: any;
declare let $: any;
declare let _: any;

@Component({
    selector: 'user-listing',
    templateUrl: 'app/user_listing.component.html'
})

export class UserListingComponent implements OnInit {
    constructor(
        private _router: Router,
        private _userService: UserService) { }

    users: User[] = [];
    selectedUser: User = new User();
    dataTable: any;

    ngOnInit() {
        this.fetchUsers(false);

        // LOADING ANIMATION
        $('#progressBar').show();
    }

    addUserClick() {
        this._router.navigate(['users/create']);
    }

    fetchUsers(retrieve:boolean) {
        this._userService.getUsers().then(
            users => {
                // STOP ANIMATION
                $('#progressBar').hide();

                // Check for zero users returned
                if (_.isEmpty(users)) {
                    console.log("There are no users");
                    return;
                }

                this.users = users;

                // For whatever reason we have to wait on Angular to template the data, and then execute DataTables
                let millisecondsToWait = 100;
                setTimeout(function() {
                    // Whatever you want to do after the wait
                    // Use jQuery and Datatables to build-out Grid UI
                    this.dataTable = $('#dataTables-users').DataTable({
                        retrieve: retrieve,
                        responsive: true,
                        bSort: false
                    });
                }, millisecondsToWait);
            },
            error => console.log("Error Fetching Users => " + error)
        );
    }

    onUserClick(id, name, email, password, role, region){
        $('#userModal').modal();
        $('#name').val(name);
        $('#email').val(email);
        $('#password').val(password);
        $('#role').val(role);
        $('#region').val(region);

        this.selectedUser.id = id;
        this.selectedUser.name = name;
        this.selectedUser.email = email;
        this.selectedUser.docType = "user";
    }

    saveUser(){
        this.selectedUser.name = $('#name').val();
        this.selectedUser.email = $('#email').val();
        this.selectedUser.password = $('#password').val();
        this.selectedUser.role = $('#role').val();
        this.selectedUser.region = $('#region').val();

        // Send the updated user
        this._userService.updateUser(this.selectedUser).then(
            user => {
                $('#userModal').modal('hide');

                // Refresh the grid
                this.fetchUsers(true);

            }, error => {
                console.log("There was an error updating a user, error: " + error.body);
                $('#userModal').modal('hide');
            });
    }

    deleteUser(name, email) {
        $('#deleteModal').modal();
    }
    confirmDelete() {
        console.log("Deleting user: " + this.selectedUser.name + " " + this.selectedUser.id);
        // Delete the user
        this._userService.deleteUser(this.selectedUser).then(
            user => {
                $('#deleteModal').modal('hide');
                $('#userModal').modal('hide');
                console.log("Deleting user: " + user.name + " " + user.id);
                // Refresh the grid
                this.fetchUsers(true);

            }, error => {
                console.log("There was an error deleting a user, error: " + error.body);
                $('#deleteModal').modal('hide');
                $('#userModal').modal('hide');
            });
    }
}
