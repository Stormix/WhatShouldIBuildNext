import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../atoms/Accordion';

const FAQ = () => {
  const faq = [
    {
      question: 'How does the project idea generator work?',
      answer:
        'The project idea generator uses 5 components to generate project ideas - what, for who, using what, deployed on what, and limitation. Users can select components or pick random ones to create a prompt, and then submit the prompt to OpenAI GPT-3 to generate a project idea. The AI model will also give a time estimate for how long it will take to complete the project idea and how difficult it is.'
    },
    {
      question: 'How many credits do users get on sign up?',
      answer:
        'Users get 3 credits on sign up. Each credit allows them to generate one project idea. Active users are awarded 1 credit every 24 hours.'
    },
    {
      question: 'Can users use multiple credits at once to generate multiple project ideas?',
      answer:
        'No, users can only use one credit at a time to generate one project idea. This is to discourage spamming and encourage users to focus on selecting and working on a single idea.'
    },
    {
      question: 'Can users save or bookmark project ideas for later?',
      answer:
        'Yes, users can save or bookmark project ideas for later. You can find the bookmarked ideas in the "Saved Ideas" tab on your profile page.'
    },
    {
      question: 'Are there any restrictions on the types of project ideas that can be generated?',
      answer:
        'We do not have any specific restrictions on the types of project ideas that can be generated. If you would like to suggest a new components, please contact us on our Discord server.'
    },
    {
      question: 'Can users modify the components of a prompt after they have generated an idea?',
      answer:
        'Yes, users can modify the components of a prompt to generate a new project idea. However, this will require a new credit.'
    },
    {
      question: 'How did you come up with the idea for this project?',
      answer:
        'This project idea generator idea was suggest, spec-ed and outlined by ChatGPT, a large language model trained by OpenAI based on the GPT-3.5 architecture. Check out the project repo on GitHub for more info.'
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
