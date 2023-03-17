import React from 'react';

const faq = ({value,index, toggleFAQ})=>{
  return(
	<div
	  className={"faq " + (value.open ? 'open' : '')}
	  key={index}
	  onClick={() => toggleFAQ(index)}
	>
	  <div className="faq-question">
		{value.question}
	  </div>
	  <div className="faq-answer">
		{value.answer}
	  </div>
	</div>
  )
}

export default faq;