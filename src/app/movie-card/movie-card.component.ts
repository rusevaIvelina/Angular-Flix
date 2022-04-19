import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { DescriptionViewComponent } from '../description-view/description-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  Favorites: any[] = [];
  user: any[] = [];
  userData: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.setUserInfo()
    this.getFavoriteMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getFavoriteMovies(): void {
    if (this.userData.Username == undefined || this.userData.Username == null) {
      this.setUserInfo()
    }
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.Favorites = resp.FavoriteMovies;
      console.log(this.Favorites);
    });
  }

  openDescriptionDialog(title: string, description: string): void {
    this.dialog.open(DescriptionViewComponent, {
      data: { Title: title, Description: description },
      panelClass: 'popupClass',
    })
  }

  openDirectorDialog(
    name: string,
    bio: string,
    birth: string,
    death: string
  ): void {
    this.dialog.open(DirectorViewComponent, {
      data: { Name: name, Bio: bio, Birth: birth, Death: death },
      panelClass: 'popupClass',
    });
  }

  openGenreDialog(Name: string, Description: string): void {
    this.dialog.open(GenreViewComponent, {
      panelClass: 'popupClass',
      data: { Name: Name, Description: Description },
    })
  }

  openProfile(): void {
    this.router.navigate(['profile'])
    // localStorage.clear();
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

  addFavoriteMovie(MovieID: string, title: string): void {
    if (this.userData.Username == undefined || this.userData.Username == null) {
      this.setUserInfo()
    }
    this.fetchApiData.addFavoriteMovie(this.userData.Username, MovieID).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(`${title} has been added to your Watchlist`, 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    })
    return this.getFavoriteMovies();
  }

  removeFavoriteMovie(MovieId: string, title: string): void {
    this.fetchApiData.deleteFavMovie(this.userData.Username, MovieId).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(`${title} has been removed from your Watchlist!`, 'OK', {
        duration: 2000
      })
      this.ngOnInit();
    })
    return this.getFavoriteMovies()
  }

  isFavorite(MovieID: string): boolean {
    if (this.Favorites != undefined && this.Favorites.length > 0) {
      var ifFounded = this.Favorites.filter(
        (movie) => movie.toString() == MovieID.toString())
      return ifFounded.length > 0 ? true : false;
    }
    else {
      return false
    }
  }

  toggleFavorite(movie: any): void {
    this.isFavorite(movie._id)
      ? this.removeFavoriteMovie(movie._id, movie.Title)
      : this.addFavoriteMovie(movie._id, movie.Title);
  }

  setUserInfo() {
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  }

}
