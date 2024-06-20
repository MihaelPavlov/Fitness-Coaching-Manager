import { Component, ViewEncapsulation } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';

@Component({
  selector: 'app-exercise-builder',
  templateUrl: './exercise-builder.component.html',
  styleUrl: './exercise-builder.component.scss',
})
export class ExerciseBuidlerComponent {
    public InputType = InputType;
    protected passwordType: InputType = InputType.Password;

    public optionArrays = optionArrays
}
