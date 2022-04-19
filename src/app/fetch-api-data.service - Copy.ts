import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

let apiUrl = 'https://myflix-movietime.herokuapp.com/'
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  // User Registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //User Login
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }


  //Making the api call for getting all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      //map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  //Get a single movie
  getMovie(title: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<typeof title>(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Get Director
  getDirector(director: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<typeof director>(apiUrl + 'directors/' + director, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Get genre
  getGenre(genre: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<typeof genre>(apiUrl + 'genres/' + genre, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Get user by username 
  getUser(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<typeof username>(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Get favorite movie 
  getFavoriteMovies(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<typeof username>(apiUrl + 'users/' + username + 'movies/', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Add favorite movie
  addFavoriteMovie(username: string, movieId: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<typeof movieId>(apiUrl + 'users/' + username + '/movies/' + movieId, movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Deletes movie from user's profile 
  deleteFavMovie(username: string, movieId: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<typeof movieId>(apiUrl + 'users/' + username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Edits user info
  editUser(userDetails: any): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.put<typeof userDetails>(apiUrl + 'users/' + username, userDetails, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Deletes user profile
  deleteUser(username: any): Observable<any> {
    //const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.delete<typeof username>(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }



  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}