import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @Input() productData: any;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.productData,"dfwdihdfvujv");
  }

}
