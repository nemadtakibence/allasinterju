import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DtoTest } from '../../commons/dtos/DtoTest';
import { DtoTestState } from '../../commons/dtos/DtoTestState';
import { AlgorithmSolutionSubmission, DesignSolutionSubmission, DevOpsSolutionSubmission } from '../../commons/dtos/DtoSubmissions';
import { BAlgorithmAdd } from '../../commons/dtos/DtoAlgorithmAdd';
import { DtoRound } from '../../commons/dtos/DtoRound';
import { RSolveP } from '../../commons/dtos/DtoProgrammingAdd';

@Injectable({
 providedIn: 'root'
})
export class JobTestsService {
 private apiUrl = 'http://localhost:5000';
 private testStatesSubject = new BehaviorSubject<DtoTestState[]>([]);
 
 private sampleTest: DtoTest = {
   id: 1,
   name: "Sum Two Numbers",
   type: "programming",
   duration: 30,
   isCompleted: false,
   description: "Write a function that takes two numbers as input and returns their sum.",
   testCases: [
     {
       input: "2, 3",
       expectedOutput: "5"
     },
     {
       input: "-1, 1",
       expectedOutput: "0"
     }
   ]
 };

 testStates$ = this.testStatesSubject.asObservable();

 constructor(private http: HttpClient) {}
 //korok leszedése a backendről
 /*getTestsForJob(jobId: number): Observable<Array<DtoRound>> {
  return this.http.get<Array<DtoRound>>(`${this.apiUrl}/Job/GetRounds/${jobId}`,{withCredentials : true});
 }*/




  //itt at kell irni madj DtoRounds[]-ra csak
  //csak igy mukodik a gomb de nem fog egyezni az object
  getTestsForJob(jobId: number): Observable<DtoRound[]> {
   
    return this.http.get<DtoRound[]>(`${this.apiUrl}/job/getRounds/${jobId}`);
  }
 getTestStates(jobId: number): Observable<DtoTestState[]> {
   // Ideiglenesen üres állapotot adunk vissza
   return of([]);
   // return this.http.get<DtoTestState[]>(`${this.apiUrl}/jobs/${jobId}/test-states`)
   //   .pipe(
   //     tap(states => this.testStatesSubject.next(states))
   //   );
 }

 saveTestState(jobId: number, testId: number, state: Partial<DtoTestState>): Observable<DtoTestState> {
   const mockState: DtoTestState = {
     id: 1,
     jobApplicationId: jobId,
     testId: testId,
     isCompleted: state.isCompleted || false,
     answers: state.answers || '',
     lastModified: new Date()
   };

   return of(mockState).pipe(
     tap(newState => {
       const currentStates = this.testStatesSubject.value;
       const index = currentStates.findIndex(s => s.testId === testId);
       if (index >= 0) {
         currentStates[index] = newState;
       } else {
         currentStates.push(newState);
       }
       this.testStatesSubject.next(currentStates);
     })
   );

   // return this.http.post<DtoTestState>(
   //   `${this.apiUrl}/jobs/${jobId}/tests/${testId}/state`,
   //   state
   // ).pipe(
   //   tap(newState => {
   //     const currentStates = this.testStatesSubject.value;
   //     const index = currentStates.findIndex(s => s.testId === testId);
   //     if (index >= 0) {
   //       currentStates[index] = newState;
   //     } else {
   //       currentStates.push(newState);
   //     }
   //     this.testStatesSubject.next(currentStates);
   //   })
   // );
 }

  checkAllTestsCompleted(jobId: number): Observable<boolean> {
   // Ideiglenesen mindig false-t adunk vissza
    return of(false);
   // return this.http.get<boolean>(`${this.apiUrl}/jobs/${jobId}/tests/completed`);
  }

  saveDraftAnswer(jobId: number, testId: number, answer: any): Observable<void> {
   // Ideiglenesen csak egy üres Observable-t adunk vissza
    return of(void 0);
   // return this.http.post<void>(
   //   `${this.apiUrl}/jobs/${jobId}/tests/${testId}/draft`,
   //   { answer }
   // );
 }
}