import { Component } from "react";
import { WhatIsIt } from "../Components/Home/WhatIsIt.jsx";
import { Why } from "../Components/Home/Why.jsx";
import { ForWhom } from "../Components/Home/ForWhom.jsx";
import { HowToUsedIt } from "../Components/Home/HowToUseIt.jsx";

export class Home extends Component {
  render() {
    return (
      <>
        <h1>Welcome to convex.city !</h1>

        <img className="w-[360px] p-2 m-auto md:w-[560px] " src="src\assets\pictures\convexImg.png" alt="" />

        <WhatIsIt></WhatIsIt>
        <Why></Why>
        <ForWhom></ForWhom>
        <HowToUsedIt></HowToUsedIt>
      </>
    );
  }
}