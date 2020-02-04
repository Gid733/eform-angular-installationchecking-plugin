import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  selector: 'element-number',
  templateUrl: './element-number.component.html',
  styleUrls: ['./element-number.component.scss']
})
export class ElementNumberComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
    this.fieldValueObj.value = val.value.replace('.', ',');
  }

  constructor() {

  }
}
