from app.services.answer_evaluator import evaluate_answer


question = """
You are finalizing a production-ready system prompt for an enterprise
chatbot using prompt templates, and you need to choose between a
Few-Shot variation and a Chain-of-Thought variation. While Chain-of-Thought
yields higher accuracy on complex queries, it introduces higher latency,
token costs, and occasional verbose responses that risk violating tone
and compliance constraints.

How would you design a systematic evaluation framework using a fixed
test set to quantitatively benchmark these prompt variations across
accuracy, compliance, and performance metrics, and what specific criteria
would drive your final decision for production deployment?
"""


answer = """
I would first create a fixed evaluation dataset representing the
production distribution, including simple, complex, ambiguous, and
high-risk queries. I would keep the dataset identical for both prompt
variants.

For accuracy, I would define expected outcomes or reference answers
where possible and measure task accuracy. For compliance, I would create
specific checks for policy violations, required tone, and undesirable
output patterns.

For performance, I would measure latency, token consumption, and cost
per request. I would run both prompt variants across the same dataset
and compare the results.

I would not automatically choose the prompt with the highest accuracy.
I would establish production thresholds for compliance and latency first.
If Chain-of-Thought provides only a small accuracy improvement while
significantly increasing cost or latency, I would choose the Few-Shot
version. If the accuracy improvement is substantial and the additional
cost and latency remain within our production constraints, I would
choose Chain-of-Thought.
"""


evaluation = evaluate_answer(
    question,
    answer,
)

print("========== ANSWER EVALUATION ==========")
print(evaluation.model_dump_json(indent=2))