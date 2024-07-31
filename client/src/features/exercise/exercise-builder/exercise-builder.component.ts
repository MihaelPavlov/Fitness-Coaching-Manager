import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { Router } from '@angular/router';
import { difficultyList } from '../../../shared/option-arrays/difficulty-list';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IExerciseEquipment } from '../../../entities/exercises/models/exercise-equipment.interface';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { Tag } from '../../../entities/models/tag.interface';
import { toFormData } from '../../../shared/utils/formTransformer';

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

  protected equipmentList$!: Observable<IExerciseEquipment[]>;
  protected tagList$!: Observable<IExerciseTag[]>;

  equipmentSettings: IDropdownSettings = {
    idField: 'uid',
    textField: 'title',
    itemsShowLimit:2,
    noDataAvailablePlaceholderText:'No equipments available'
  };

  tagSettings: IDropdownSettings = {
    idField: 'uid',
    textField: 'name',
    itemsShowLimit:2,
    noDataAvailablePlaceholderText:'No tags available'
  };

  protected exerciseForm = this.fb.group({
    title: ['', Validators.required],
    thumbUri: [null, Validators.required],
    difficulty: ['', Validators.required],
    equipmentIds: [[], Validators.required],
    tagIds: [[], Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly exerciseService: ExerciseService,
    private readonly router: Router
  ) {}

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

    console.log(submissionData);

    this.exerciseService.create(toFormData(submissionData)).subscribe({
      next: () => {
        this.isLoading = false;
        this.hasExerciseError = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.createExerciseErrorMsg = err.error.data[0].message;
        this.hasExerciseError = true;
      },
    });
  }

  public onImageUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.item(files.length - 1);
    const selectedFile = this.exerciseForm.get('thumbUri') as FormControl;
    selectedFile.setValue(file);
  }

  public onEqipmentItemSelect(item: Equipment): void {
    const equipmentFormArray = this.exerciseForm.get(
      'equipmentIds'
    ) as FormControl;
    equipmentFormArray.setValue([...equipmentFormArray.value, item]);
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
    tagFormArray.setValue([...tagFormArray.value, item]);
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
    const tagFormArray = this.exerciseForm.get('tagIds') as FormControl;
    tagFormArray.setValue(items);
  }

  public onTagDeselectAll(): void {
    const tagFormArray = this.exerciseForm.get('tagIds') as FormControl;
    tagFormArray.setValue([]);
  }
}
