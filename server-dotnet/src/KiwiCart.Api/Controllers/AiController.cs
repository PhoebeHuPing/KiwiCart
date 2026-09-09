using KiwiCart.Core.DTOs;
using KiwiCart.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace KiwiCart.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AiController : ControllerBase
{
    // Guard against oversized prompts before spending an AI call.
    private const int MaxPromptLength = 500;

    private readonly IMealPlanService _mealPlanService;

    public AiController(IMealPlanService mealPlanService)
        => _mealPlanService = mealPlanService;

    /// <summary>
    /// Turn a plain-language meal/shopping request into a costed shopping list:
    /// AI extracts the ingredients, then each is priced across supermarkets.
    /// </summary>
    [HttpPost("meal-plan")]
    [EnableRateLimiting("ai")]
    [ProducesResponseType(typeof(MealPlanResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<MealPlanResponse>> MealPlan(
        [FromBody] MealPlanRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
            return Problem("Prompt is required.", statusCode: 400);

        if (request.Prompt.Length > MaxPromptLength)
            return Problem($"Prompt must be {MaxPromptLength} characters or fewer.", statusCode: 400);

        var result = await _mealPlanService.PlanAsync(request.Prompt.Trim(), ct);
        return Ok(result);
    }
}
