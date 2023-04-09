import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../atoms/Accordion';

const FAQ = () => {
  const faq = [
    {
      question: 'Is it accessible?',
      answer: 'Yes. It adheres to the WAI-ARIA design pattern.'
    },
    {
      question: 'Is it styled?',
      answer: 'Yes. It comes with default styles that matches the other components aesthetic.'
    },
    {
      question: 'Is it animated?',
      answer: "Yes. It's animated by default, but you can disable it if you prefer."
    },
    {
      question: 'Is it animated?',
      answer: "Yes. It's animated by default, but you can disable it if you prefer."
    },
    {
      question: 'Is it animated?',
      answer: "Yes. It's animated by default, but you can disable it if you prefer."
    },
    {
      question: 'Is it animated?',
      answer: "Yes. It's animated by default, but you can disable it if you prefer."
    }
  ];

  return (
    <div className="z-20 flex flex-col items-center justify-center px-6 py-14 lg:px-8">
      <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-6/12">
        {faq.map((qa, index) => (
          <AccordionItem value={`faq-${index}`} key={index}>
            <AccordionTrigger>{qa.question}</AccordionTrigger>
            <AccordionContent>{qa.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
