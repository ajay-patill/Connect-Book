import { faqData } from '../data/faq';

export function FAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Frequently Asked Questions
      </h1>
      <div className="space-y-6">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-sm p-6 space-y-2"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {faq.question}
            </h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}