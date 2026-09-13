from django.db import models

# Create your models here.
from django.db import models
from django.utils.text import slugify




class MediaFile(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('video', 'Video'),
        ('audio', 'Audio'),
    ]
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('completed', 'Completed'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='processing')
    
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='sample/')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    description = models.TextField(blank=True)  # Description field for media
    views = models.PositiveIntegerField(default=0)  # To track number of views
    likes = models.PositiveIntegerField(default=0)  # To track likes
    dislikes = models.PositiveIntegerField(default=0)  # To track dislikes
    created_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails',null=True,blank=True)
    hls = models.URLField(blank=True, null=True)  # Link to HLS streaming URL
    duration = models.DurationField(blank=True, null=True)  # Video duration
    
    # Auto-generate slug from title for SEO-friendly URLs
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(MediaFile, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'tbl_mediafile'
