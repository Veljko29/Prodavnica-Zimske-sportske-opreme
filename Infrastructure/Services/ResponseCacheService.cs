using System;
using System.Collections.Concurrent;
using System.Text.Json;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        private readonly ConcurrentDictionary<string, (string Value, DateTime Expiry)> _cache
            = new ConcurrentDictionary<string, (string, DateTime)>();

        public Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
        {
            if (response == null) return Task.CompletedTask;

            var serialized = JsonSerializer.Serialize(response);
            var expiry = DateTime.UtcNow.Add(timeToLive);
            _cache[cacheKey] = (serialized, expiry);
            return Task.CompletedTask;
        }

        public Task<string?> GetCachedResponseAsync(string cacheKey)
        {
            if (_cache.TryGetValue(cacheKey, out var entry))
            {
                if (entry.Expiry > DateTime.UtcNow)
                    return Task.FromResult<string?>(entry.Value);
                else
                    _cache.TryRemove(cacheKey, out _);
            }
            return Task.FromResult<string?>(null);
        }

        public Task RemoveCacheByPattern(string pattern)
        {
            foreach (var key in _cache.Keys)
            {
                if (key.Contains(pattern))
                    _cache.TryRemove(key, out _);
            }
            return Task.CompletedTask;
        }
    }
}
