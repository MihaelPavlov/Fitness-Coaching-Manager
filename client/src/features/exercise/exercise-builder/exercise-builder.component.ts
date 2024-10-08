import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { difficultyList } from '../../../shared/option-arrays/difficulty-list';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IExerciseEquipment } from '../../../entities/exercises/models/exercise-equipment.interface';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { Tag } from '../../../entities/models/tag.interface';
import { toFormData } from '../../../shared/utils/formTransformer';
import { environment } from '../../../shared/environments/environment.development';
import { ALLOWED_FILE_TYPES } from '../../../shared/constants/allowed-files.constant';

interface Equipment extends ListItem {
  uid?: number;
  title?: string;
}

@Component({
  selector: 'app-exercise-builder',
  templateUrl: './exercise-builder.component.html',
  styleUrl: './exercise-builder.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ExerciseBuidlerComponent implements OnInit {
  public InputType = InputType;
  public isLoading: boolean = false;
  public optionArrays = optionArrays;
  protected hasExerciseError: boolean = false;
  protected createExerciseErrorMsg: string = '';
  protected difficultyArr = Object.entries(difficultyList);
  protected exerciseId: string | undefined;
  protected equipmentList$!: Observable<IExerciseEquipment[]>;
  protected equipmentListEdit!: IExerciseEquipment[];
  protected tagList$!: Observable<IExerciseTag[]>;
  protected tagListEdit!: IExerciseTag[];
  public isEditMode: boolean = false; // Edit mode

  public get fileName(): string {
    return this.exerciseForm.get('thumbUri')?.value?.name || this.exerciseForm.get('thumbUri')?.value;
  }

  equipmentSettings: IDropdownSettings = {
    idField: 'uid',
    textField: 'title',
    itemsShowLimit: 2,
    noDataAvailablePlaceholderText: 'No equipments available',
  };

  tagSettings: IDropdownSettings = {
    idField: 'uid',
    textField: 'name',
    itemsShowLimit: 2,
    noDataAvailablePlaceholderText: 'No tags available',
  };

  public exerciseForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly exerciseService: ExerciseService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private location: Location
  ) {
    if (!this.isEditMode) {
      this.exerciseForm = this.fb.group({
        title: ['', Validators.required],
        thumbUri: [null, Validators.required],
        difficulty: ['', Validators.required],
        equipmentIds: [[]],
        tagIds: [[]],
        description: ['', Validators.required],
      });
    } else {
      this.exerciseForm = this.fb.group({
        title: ['', Validators.required],
        thumbUri: [null, [Validators.required]],
        difficulty: ['', Validators.required],
        equipmentIds: [[]],
        tagIds: [[]],
        description: ['', Validators.required],
      });
    }
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.equipmentList$ = this.exerciseService
      .getEquipmentList({
        what: {
          uid: 1,
          title: 1,
        },
      })
      .pipe(
        map(
          (res: IRequestResult<IExerciseEquipment[]> | null) => res?.data ?? []
        )
      );

    this.tagList$ = this.exerciseService
      .getTagList({
        what: {
          uid: 1,
          name: 1,
        },
      })
      .pipe(
        map((res: IRequestResult<IExerciseTag[]> | null) => res?.data ?? [])
      );

    this.route.paramMap.subscribe((params) => {
      const id = params.get('exerciseId');
      if (id) {
        this.exerciseId = id;
        this.isEditMode = true;
        this.loadExerciseDetails(this.exerciseId);
      }
    });
  }

  private loadExerciseDetails(id: string): void {
    this.exerciseService
      .getDetails({
        what: {
          uid: 1,
          title: 1,
          thumbUri: 1,
          difficulty: 1,
          equipmentIds: 1,
          description: 1,
          tagIds: 1,
        },
        condition: {
          type: 'AND',
          items: [
            {
              field: 'uid',
              operation: 'EQ',
              value: id,
            },
          ],
        },
      })
      .pipe(take(1))
      .subscribe(
        (result) => {
          if (result?.data && result.data.length > 0) {
            const exercise = result.data[0];
            console.log(exercise.tagIds);
            console.log(exercise.equipmentIds);
            console.log(exercise.thumbUri);

            this.tagList$.subscribe((result) => {
              this.tagListEdit = result.filter((item) =>
                exercise.tagIds.split(',').map(Number).includes(item.uid)
              );
              this.onTagSelectAllEdit(this.tagListEdit);
            });

            this.equipmentList$.subscribe((result) => {
              this.equipmentListEdit = result.filter((item) =>
                exercise.equipmentIds.split(',').map(Number).includes(item.uid)
              );
              this.onEquipmentSelectAllEdit(this.equipmentListEdit);
            });

            this.exerciseForm.patchValue({
              title: exercise.title,
              difficulty: exercise.difficulty as number,
              description: exercise.description || null,
              thumbUri: exercise.thumbUri,
            });
          }
        },
        (error) => {
          console.error('Error fetching exercise details:', error);
        }
      );
  }

  protected create(): void {
    this.isLoading = true;

    if (this.exerciseForm.invalid) {
      this.isLoading = false;
      return;
    }

    const formValue = this.exerciseForm.value;
    const equipmentIds = (formValue.equipmentIds ?? [])
      .map((item: { uid: string }) => item.uid)
      .map(String)
      .join(',');
    const tagIds = (formValue.tagIds ?? [])
      .map((item: { uid: string }) => item.uid)
      .map(String)
      .join(',');

    const submissionData = {
      ...this.exerciseForm.value,
      equipmentIds,
      tagIds,
    };

    if (this.isEditMode && this.exerciseId) {
      submissionData.difficulty = Number(submissionData.difficulty);
      this.exerciseService.update(this.exerciseId, toFormData(submissionData)).subscribe({
        next: () => {
          this.isLoading = false;
          this.hasExerciseError = false;
          this.router.navigate([`/exercise/details/${this.exerciseId}`]);
        },
        error: (err) => {
          this.isLoading = false;
          this.createExerciseErrorMsg = Array.isArray(err.error.data)
            ? err.error.data[0].message
            : err.error.data.message;
          this.hasExerciseError = true;
        },
      });
    } else {
      this.exerciseService.create(toFormData(submissionData)).subscribe({
        next: () => {
          this.isLoading = false;
          this.hasExerciseError = false;
          this.router.navigate(['/exercise/list']);
        },
        error: (err) => {
          this.isLoading = false;
          this.createExerciseErrorMsg = Array.isArray(err.error.data)
            ? err.error.data[0].message
            : err.error.data.message;
          this.hasExerciseError = true;
        },
      });
    }
  }

  public onImageUpload(event: any) {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(files.length - 1);

    if (!ALLOWED_FILE_TYPES.includes(file?.type as string)) {
      alert("Only images allowed");
      event.target.value = null;
      return;
    }

    const selectedFile = this.exerciseForm.get('thumbUri') as FormControl;
    selectedFile.setValue(file);
  }

  public onEqipmentItemSelect(item: Equipment): void {
    const equipmentFormArray = this.exerciseForm.get(
      'equipmentIds'
    ) as FormControl;
    const currentValues = equipmentFormArray.value;

    if (!currentValues.some((e: any) => e.uid === item.uid)) {
      equipmentFormArray.setValue([...currentValues, item]);
    }
  }

  public onEquipmentDeselect(item: Equipment): void {
    const equipmentArray = this.exerciseForm.get('equipmentIds') as FormControl;
    const index = equipmentArray.value.findIndex(
      (e: any) => e.uid === item.uid
    );
    if (index !== -1) {
      const updatedEquipment = [...equipmentArray.value];
      updatedEquipment.splice(index, 1);
      equipmentArray.setValue(updatedEquipment);
    }
  }

  public onEquipmentSelectAll(items: Equipment[]): void {
    const equipmentArray = this.exerciseForm.get('equipmentIds') as FormControl;
    equipmentArray.setValue(items);
  }

  public onEquipmentDeselectAll(): void {
    const equipmentArray = this.exerciseForm.get('equipmentIds') as FormControl;
    equipmentArray.setValue([]);
  }

  public onTagItemSelect(item: Tag): void {
    const tagFormArray = this.exerciseForm.get('tagIds') as FormControl;
    const currentValues = tagFormArray.value;

    if (!currentValues.some((e: any) => e.uid === item.uid)) {
      tagFormArray.setValue([...currentValues, item]);
    }
  }

  public onTagDeselect(item: Tag): void {
    const tagFormArray = this.exerciseForm.get('tagIds') as FormControl;
    const index = tagFormArray.value.findIndex((e: any) => e.uid === item.uid);
    if (index !== -1) {
      const updatedEquipment = [...tagFormArray.value];
      updatedEquipment.splice(index, 1);
      tagFormArray.setValue(updatedEquipment);
    }
  }

  public onTagSelectAll(items: Tag[]): void {
    console.log(items);

    const tagFormArray = this.exerciseForm.get('tagIds') as FormControl;
    tagFormArray.setValue(items);
  }

  public onTagDeselectAll(): void {
    const tagFormArray = this.exerciseForm.get('tagIds') as FormControl;
    tagFormArray.setValue([]);
  }

  public onTagSelectAllEdit(items: IExerciseTag[]): void {
    const tagFormArray = this.exerciseForm.get('tagIds') as FormControl;
    tagFormArray.setValue(items);
  }

  public onEquipmentSelectAllEdit(items: IExerciseEquipment[]): void {
    const equipmentFormArray = this.exerciseForm.get(
      'equipmentIds'
    ) as FormControl;
    equipmentFormArray.setValue(items);
  }
}
