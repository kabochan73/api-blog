<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user', 'tags'])->latest();

        $user = auth('sanctum')->user();
        if (!$user?->is_admin) {
            $query->where('status', 'published');
        } elseif ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $request->tag));
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('body', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->paginate(10));
    }

    public function show(Post $post): JsonResponse
    {
        $user = auth('sanctum')->user();
        if ($post->status === 'draft' && !$user?->is_admin) {
            return response()->json(['message' => '投稿が見つかりません'], 404);
        }

        $post->load(['user', 'tags']);

        return response()->json($post);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'status' => ['sometimes', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'tag_ids' => ['sometimes', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ]);

        $post = $request->user()->posts()->create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'body' => $validated['body'],
            'status' => $validated['status'] ?? 'draft',
            'published_at' => $validated['published_at'] ?? null,
        ]);

        if (!empty($validated['tag_ids'])) {
            $post->tags()->sync($validated['tag_ids']);
        }

        $post->load(['user', 'tags']);

        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post): JsonResponse
    {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'body' => ['sometimes', 'string'],
            'status' => ['sometimes', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'tag_ids' => ['sometimes', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ]);

        $post->update([
            'title' => $validated['title'] ?? $post->title,
            'body' => $validated['body'] ?? $post->body,
            'status' => $validated['status'] ?? $post->status,
            'published_at' => array_key_exists('published_at', $validated)
                ? $validated['published_at']
                : $post->published_at,
        ]);

        if (array_key_exists('tag_ids', $validated)) {
            $post->tags()->sync($validated['tag_ids']);
        }

        $post->load(['user', 'tags']);

        return response()->json($post);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $post->delete();

        return response()->json(['message' => '投稿を削除しました']);
    }
}
