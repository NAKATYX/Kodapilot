import OpenAI from 'openai';

interface Product {
  name: string;
  price: number;
  margin_bps: number;
}

interface ProductSuggestion {
  products: Product[];
  proof: string;
}

interface ListingCopy {
  copy: string;
  proof: string;
}

interface FraudCheck {
  score: number; // 0-100
  reason: string;
  proof: string;
}

export class ComputeClient {
  private client: OpenAI;
  private routerUrl: string;

  constructor(routerUrl: string, apiKey: string) {
    this.routerUrl = routerUrl;
    // Initialize OpenAI client pointing to 0G Compute Router
    this.client = new OpenAI({
      apiKey,
      baseURL: routerUrl,
    });
  }

  /**
   * Suggest products for resale based on category and budget
   */
  async suggestProduct(
    category: string,
    budget: number,
    count: number = 3
  ): Promise<ProductSuggestion> {
    const prompt = `You are a product resale expert. Given a category and budget, suggest ${count} genuine, high-margin products to resell.

Category: ${category}
Budget: $${budget}

Return a valid JSON array with exactly ${count} products. Each product must have:
- "name" (string): product name
- "price" (number): wholesale price
- "margin_bps" (number): resale margin in basis points (e.g., 5000 for 50% margin)

Example format:
[
  { "name": "Product Name", "price": 10.00, "margin_bps": 5000 },
  { "name": "Another Product", "price": 15.00, "margin_bps": 4000 }
]

Return ONLY the JSON array, no other text.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content || '[]';
      const products = JSON.parse(content) as Product[];

      // Validate response
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error('Invalid products response');
      }

      // TEE proof is included in response headers (simulated here)
      const proof = response.id || 'proof_simulated';

      return { products, proof };
    } catch (err) {
      console.error('Error suggesting products:', err);
      throw err;
    }
  }

  /**
   * Generate compelling listing copy for a product
   */
  async generateListingCopy(
    product: string,
    margin_bps: number
  ): Promise<ListingCopy> {
    const marginPercent = margin_bps / 100;
    const prompt = `You are a copywriter for an e-commerce reseller. Write a compelling, one-line product listing that emphasizes resale value and appeal.

Product: ${product}
Resale Margin: ${marginPercent}%

Write a single, punchy sentence (max 100 chars) that would attract buyers. Be engaging and highlight unique value.
Return ONLY the listing copy, no quotes or extra text.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 150,
      });

      const copy = response.choices[0]?.message?.content || '';
      const proof = response.id || 'proof_simulated';

      return { copy: copy.trim(), proof };
    } catch (err) {
      console.error('Error generating listing copy:', err);
      throw err;
    }
  }

  /**
   * Assess fraud risk for an order
   */
  async checkFraud(
    vendorReputation: number,
    orderAmount: bigint
  ): Promise<FraudCheck> {
    const amountEth = Number(orderAmount) / 1e18;
    const prompt = `You are a fraud detection expert for a trust-based marketplace. Assess the risk of an order based on vendor reputation and amount.

Vendor Reputation Score: ${vendorReputation} (0-1000, higher is better)
Order Amount: ${amountEth.toFixed(2)} ETH

Provide a risk assessment:
1. Analyze reputation (low <100, medium 100-500, high >500)
2. Consider amount relative to reputation (large orders from low-rep vendors = risky)
3. Return a JSON object with:
   - "score" (number 0-100): fraud risk score (0=safe, 100=definitely fraud)
   - "reason" (string): brief explanation

Return ONLY the JSON object, no other text.

Example:
{ "score": 42, "reason": "New vendor with moderate order size. Recommend escrow monitoring." }`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5, // Lower temperature for consistent fraud scoring
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const result = JSON.parse(content) as { score: number; reason: string };

      // Validate response
      if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
        result.score = Math.max(0, Math.min(100, result.score || 0));
      }

      const proof = response.id || 'proof_simulated';

      return { ...result, proof };
    } catch (err) {
      console.error('Error checking fraud:', err);
      // Return safe default on error
      return {
        score: 50,
        reason: 'Unable to assess risk; defaulting to moderate caution',
        proof: 'error',
      };
    }
  }

  /**
   * Verify that a response came from 0G Compute TEE
   * In production, this would verify the TEE signature
   */
  async verifyProof(proof: string): Promise<boolean> {
    // Placeholder: in production, verify against 0G attestation service
    return proof !== 'error' && proof.length > 0;
  }
}
