
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImageAnnotations } from '@/hooks/useImageAnnotations';
import { usePatterns } from '@/hooks/usePatterns';
import type { ImageAnnotation } from '@/types/patterns';

interface ImageAnnotatorProps {
  imageUrl: string;
  imageId: string;
  imageType: 'symbol' | 'contribution';
  symbolId?: string;
  onAnnotationCreated?: (annotation: ImageAnnotation) => void;
}

export const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  imageUrl,
  imageId,
  imageType,
  symbolId,
  onAnnotationCreated
}) => {
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [currentAnnotation, setCurrentAnnotation] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { annotations, createAnnotation, refetch } = useImageAnnotations(imageId, imageType);
  const { patterns } = usePatterns(symbolId);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAnnotating || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentAnnotation({
      startX: x,
      startY: y,
      endX: x,
      endY: y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isAnnotating || !currentAnnotation || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentAnnotation(prev => prev ? {
      ...prev,
      endX: x,
      endY: y
    } : null);
  };

  const handleMouseUp = async () => {
    if (!currentAnnotation || !selectedPattern) return;

    const width = Math.abs(currentAnnotation.endX - currentAnnotation.startX);
    const height = Math.abs(currentAnnotation.endY - currentAnnotation.startY);

    if (width < 1 || height < 1) {
      setCurrentAnnotation(null);
      return;
    }

    try {
      const annotation = await createAnnotation({
        image_id: imageId,
        image_type: imageType,
        pattern_id: selectedPattern,
        annotation_data: {
          type: 'rectangle',
          coordinates: [
            Math.min(currentAnnotation.startX, currentAnnotation.endX),
            Math.min(currentAnnotation.startY, currentAnnotation.endY),
            width,
            height
          ]
        },
        validation_status: 'pending',
        notes: notes || undefined
      });

      if (onAnnotationCreated) {
        onAnnotationCreated(annotation);
      }

      setCurrentAnnotation(null);
      setNotes('');
      setIsAnnotating(false);
    } catch (error) {
      console.error('Error creating annotation:', error);
    }
  };

  const renderAnnotations = () => {
    return annotations.map((annotation) => {
      const coords = annotation.annotation_data.coordinates;
      if (coords.length < 4) return null;

      return (
        <div
          key={annotation.id}
          className="absolute border-2 border-amber-400 bg-amber-400/20 pointer-events-none"
          style={{
            left: `${coords[0]}%`,
            top: `${coords[1]}%`,
            width: `${coords[2]}%`,
            height: `${coords[3]}%`
          }}
        >
          <div className="absolute -top-6 left-0 text-xs bg-amber-400 text-white px-2 py-1 rounded">
            {annotation.pattern?.name || 'Motif'}
          </div>
        </div>
      );
    });
  };

  const renderCurrentAnnotation = () => {
    if (!currentAnnotation) return null;

    const width = Math.abs(currentAnnotation.endX - currentAnnotation.startX);
    const height = Math.abs(currentAnnotation.endY - currentAnnotation.startY);

    return (
      <div
        className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
        style={{
          left: `${Math.min(currentAnnotation.startX, currentAnnotation.endX)}%`,
          top: `${Math.min(currentAnnotation.startY, currentAnnotation.endY)}%`,
          width: `${width}%`,
          height: `${height}%`
        }}
      />
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Annotation des motifs</h3>
          <div className="flex gap-2">
            <Badge variant={isAnnotating ? "default" : "secondary"}>
              {isAnnotating ? "Mode annotation actif" : "Mode visualisation"}
            </Badge>
            <Button
              onClick={() => setIsAnnotating(!isAnnotating)}
              variant={isAnnotating ? "destructive" : "default"}
            >
              {isAnnotating ? "Arrêter" : "Annoter"}
            </Button>
          </div>
        </div>

        {isAnnotating && (
          <div className="space-y-3">
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un motif" />
              </SelectTrigger>
              <SelectContent>
                {patterns.map((pattern) => (
                  <SelectItem key={pattern.id} value={pattern.id}>
                    {pattern.name} ({pattern.pattern_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Notes sur cette annotation (optionnel)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        )}

        <div 
          ref={containerRef}
          className="relative cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Image à annoter"
            className="w-full h-auto max-h-96 object-contain"
            draggable={false}
          />
          {renderAnnotations()}
          {renderCurrentAnnotation()}
        </div>

        <div className="text-sm text-gray-600">
          {annotations.length > 0 && (
            <p>{annotations.length} annotation(s) sur cette image</p>
          )}
          {isAnnotating && (
            <p>Cliquez et faites glisser pour créer une annotation rectangulaire</p>
          )}
        </div>
      </div>
    </Card>
  );
};
