using Microsoft.AspNetCore.SignalR;

namespace RestaurantBackend.Hubs;

public class OrderHub : Hub
{
    // Owner joins "owners" group; customers join "table-{n}" group
    public async Task JoinOwnerGroup()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "owners");
    }

    public async Task JoinTableGroup(int tableId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"table-{tableId}");
    }

    public async Task LeaveTableGroup(int tableId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"table-{tableId}");
    }
}
