import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  userData: any = { Username: null, Password: null, Email: null, Birthday: null };
  userFromStorage: any = localStorage.getItem('user');
  currentUser: any = JSON.parse(this.userFromStorage) || {};
  currentUsername: any = this.currentUser.Username;
  currentFavs: any = this.currentUser.FavoriteMovies || [];
  favsEmpty: boolean = true;
  movies: any[] = [];
  isPasswordChanged: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    // this.getCurrentUser(this.currentUsername);
    this.userData.Username = this.currentUser.Username;
    this.userData.Password = null;
    this.userData.Email = this.currentUser.Email;
    this.userData.Birthday = this.currentUser.Birthday.slice(0, 10);

    this.getMovies();
  }
  backToMovies(): void {
    this.router.navigate(['movies']);
  }
  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getMovieName(id: any) {
    return this.movies.filter(x => x._id == id)[0].Title
  }

  getCurrentUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.currentUser = resp;
      console.log("Current User :", resp)
      this.currentFavs = this.currentUser.FavoriteMovies;
      this.areFavsEmpty();
      return this.currentUser
    })
  }

  areFavsEmpty(): any {
    console.log(this.currentFavs)
    if (this.currentFavs.length == 0) {
      this.favsEmpty = true;
    } else {
      this.favsEmpty = false;
    }
    return this.favsEmpty;
  }

  removeFromFavs(movieId: string): void {
    this.fetchApiData.deleteFavMovie(this.currentUsername, movieId).subscribe((resp: any) => {
      this.ngOnInit();
      this.snackBar.open('Removed from favs', 'OK',
        { duration: 2000 });
    });
    this.ngOnInit();
  }

  deleteUserProfile() {
    this.fetchApiData.deleteUser().subscribe((resp: any) => {
      this.router.navigate(["/welcome"])
      localStorage.clear();
      this.snackBar.open('Removed Profile', 'OK',
        { duration: 2000 });
    }, err => {
      if (err.status == 200) {
        this.router.navigate(["/welcome"])
        localStorage.clear();
        this.snackBar.open('Removed Profile', 'OK',
          { duration: 2000 });
      }
      else {
        this.snackBar.open('Operation Failed', 'OK',
          { duration: 2000 });
      }
    }
    );
  }

  editUserInfo(): void {
    var updatedData: any = {
      Username: this.userData.Username ? this.userData.Username : this.currentUser.Username,
      Email: this.userData.Email ? this.userData.Email : this.currentUser.Email,
      Birthday: this.userData.Birthday ? this.userData.Birthday : this.currentUser.Birthday,
    }

    if (this.isPasswordChanged == true && this.userData.Password?.length > 7) {
      updatedData.Password = this.userData.Password
    }
    else {
      updatedData.Password = localStorage.getItem("password")
    }
    if (this.userData.Password?.length < 8) {
      alert("Password must be at least 8 characters long")
      return;
    }
    if (this.userData.Username?.length <6) {
      alert("Username must be at least 6 characters long")
      return;
    }

    console.log("updated Data", updatedData)

    this.fetchApiData.editUser(updatedData).subscribe((resp: any) => {
      this.snackBar.open('Profile updated', 'OK', {
        duration: 2000
      });
      localStorage.setItem('user', JSON.stringify(resp))
      this.getCurrentUser()
    }, (resp: any) => {
      this.snackBar.open('Failed to update', 'OK', {
        duration: 2000
      })
    })
  }

  onChangePassword(event: any) {
    this.isPasswordChanged = true;
  }
}


