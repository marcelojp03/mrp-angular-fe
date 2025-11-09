import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReorderSuggestionsResponse } from './reorder-suggestions.interface';

@Injectable({
  providedIn: 'root'
})
export class ReorderSuggestionsService {
  private http = inject(HttpClient);
  private apiUrl = environment.backend.host;

  getSuggestions(): Observable<ReorderSuggestionsResponse> {
    return this.http.get<ReorderSuggestionsResponse>(`${this.apiUrl}/stocks/reorder-suggestions`);
  }
}
